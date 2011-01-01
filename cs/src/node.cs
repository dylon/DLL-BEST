/// Copyright (C) 2010 Dylon Edwards
/// 
/// This code is available under MIT License.
/// 
/// Permission is hereby granted, free of charge, to any person obtaining a copy
/// of this software and associated documentation files (the "Software"), to deal
/// in the Software without restriction, including without limitation the rights
/// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
/// copies of the Software, and to permit persons to whom the Software is
/// furnished to do so, subject to the following conditions:
/// 
/// The above copyright notice and this permission notice shall be included in
/// all copies or substantial portions of the Software.
/// 
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.

using System;

namespace DllBest {

	/// <summary>
	/// A node for use within the DLL BEST tree </summary>
	public abstract class Node<T,N> where N : Node<T,N> {


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                          Default Fields                          ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Value of this Node </summary>
		protected T m_key = default (T);

		/// <summary>
		/// Whether this.m_key has been read </summary>
		protected bool k_read = false;

		/// <summary>
		/// Value of this Node.  This property may be set as many times as one
		/// wants until get is called, at which point it becomes immutable (so
		/// it can be stored in a BST, Dictionary, etc.) </summary>
		public T Key {
			get {
				this.k_read = true;
				return this.m_key;
			}

			set {
				if (!this.k_read) {
					this.m_key = value;
				}
			}
		}


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                          Default Fields                          ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Pointer to this Node's BST parent </summary>
		public N Parent { get; set; }

		/// <summary>
		/// Pointer to this Node's left BST child </summary>
		public N LChild { get; set; }

		/// <summary>
		/// Pointer to this Node's right BST child </summary>
		public N RChild { get; set; }

		/// <summary>
		/// Number of levels within the subtree formed with this Node as the
		/// root. </summary>
		public int Height { get; set; }

		/// <summary>
		/// Pointer to the DLL node immediately less than this one </summary>
		public N Lt { get; set; }

		/// <summary>
		/// Pointer to the DLL node immediately greater than this one
		/// </summary>
		public N Gt { get; set; }

		/// <summary>
		/// Pointer to the next LL node equal to this one </summary>
		public N Eq { get; set; }


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                     DllBest.Node Constructor                     ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Constructs a new DLL BEST Node </summary>
		///
		/// <param name="Key">Value to assign this Node</param>
		public Node(T Key) {
			this.Key = Key;
		}

		/// <summary>
		/// Parameter-less constructor </summary>
		public Node()
			: this(default(T)) {
		}


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                         Instance Methods                         ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Assigns the values of the given Node to this one </summary>
		///
		/// <param name="node"> Node whose values to assign this one </param>
		/// <param name="key"> Whether to assign the value of the given Node to
		/// this one </param>
		public void Assign(N node, bool key) {
			this.Parent = (N) node.Parent;
			this.LChild = (N) node.LChild;
			this.RChild = (N) node.RChild;
			this.Height = node.Height;

			if (this.LChild != null) {
				this.LChild.Parent = (N) this;
			}

			if (this.RChild != null) {
				this.RChild.Parent = (N) this;
			}

			if (key) {
				this.Key = node.Key;
				this.Eq  = (N) node.Eq;
			}

			this.Lt = (N) node.Lt;
			this.Gt = (N) node.Gt;

			if (this.Lt != null) {
				this.Lt.Gt = (N) this;
			}

			if (this.Gt != null) {
				this.Gt.Lt = (N) this;
			}
		}

		/// <summary>
		/// Assigns the values of the given Node to this one </summary>
		///
		/// <param name="node"> Node whose values to assign this one </param>
		/// this one </param>
		public void Assign(N node) {
			this.Assign(node, false);
		}


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                         Override Methods                         ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Returns a string representation of this Node, suitable for printing
		/// </summary>
		///
		/// <returns> A string representation of this Node </returns>
		public override string ToString() {
			if (this.Key is object) {
				return "(" + this.Key.ToString() + ")";
			}

			return "(" + this.Key + ")";
		}
	}
}

