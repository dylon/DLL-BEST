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
	public abstract class Node<T,N> : INode<T,N>
		where N : Node<T,N> {


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                          Default Fields                          ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Value of this Node </summary>
		protected T m_value = default (T);

		/// <summary>
		/// Whether m_value has been read </summary>
		protected bool k_read = false;


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                            Properties                            ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		public N LChild { get; set; }

		public N RChild { get; set; }

		public int Height { get; set; }

		public int Children { get; set; }

		public N Lt { get; set; }

		public N Gt { get; set; }

		public N Eq { get; set; }

		public bool IsLeaf {
			get {
				return (Height == 0);
			}
		}

		public bool IsBranch {
			get {
				bool lc = (LChild != null);
				bool rc = (RChild != null);

				return ((lc && !rc) || (!lc && rc));
			}
		}

		public int MaxChildHeight {
			get {
				int lHeight = (LChild != null) ? LChild.Height : -1,
					rHeight = (RChild != null) ? RChild.Height : -1;
				
				return (lHeight > rHeight) ? lHeight : rHeight;
			}
		}

		public T Value {
			get {
				k_read = true;
				return m_value;
			}

			set {
				if (!k_read) {
					m_value = value;
				}
			}
		}


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                     DllBest.Node Constructor                     ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Constructs a new DLL BEST Node </summary>
		///
		/// <param name="value">Value to assign this Node</param>
		public Node(T value) {
			Value = value;
		}

		/// <summary>
		/// Parameter-less constructor </summary>
		public Node()
			: this(default (T)) {
		}


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                         Instance Methods                         ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		public void Assign(N node, bool value) {
			this.LChild   = node.LChild;
			this.RChild   = node.RChild;
			this.Height   = node.Height;
			this.Children = node.Children;

			if (value) {
				this.Value = node.Value;
				this.Eq    = node.Eq;
			}

			this.Lt = node.Lt;
			this.Gt = node.Gt;

			if (this.Lt != null) {
				this.Lt.Gt = (N) this;
			}

			if (this.Gt != null) {
				this.Gt.Lt = (N) this;
			}
		}

		public void Assign(N node) {
			Assign(node, false);
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
			if (Value is object) {
				return "(" + Value.ToString() + ")";
			}

			return "(" + Value + ")";
		}
	}
}

