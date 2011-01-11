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

namespace DllBest.Avl {

	/// <summary>
	/// A node for use within the DLL BEST tree </summary>
	public class Node<T> : DllBest.Node<T, Node<T>>, INode<T, Node<T>> {


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                          Default Fields                          ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                            Properties                            ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////
	

		public Node<T> Parent { get; set; }

		public int Balance {
			get {
				int lHeight = (LChild != null) ? LChild.Height : -1,
					rHeight = (RChild != null) ? RChild.Height : -1;

				return (lHeight - rHeight);
			}
		}

		public bool IsBalanced {
			get {
				int balance = Balance;
				return ((balance >= -1) && (balance <= 1));
			}
		}


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                   DllBest.Avl.Node Constructor                   ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////	


		/// <summary>
		/// Constructs a new DLL BEST Node </summary>
		///
		/// <param name="value">Value to assign this Node</param>
		public Node(T value)
			: base(value) {
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


		new public void Assign(Node<T> node, bool value) {
			base.Assign(node, value);

			this.Parent = node.Parent;

			if (this.LChild != null) {
				this.LChild.Parent = this;
			}

			if (this.RChild != null) {
				this.RChild.Parent = this;
			}
		}

		/// <summary>
		/// Returns a string representation of this Node, suitable for printing
		/// </summary>
		///
		/// <returns> A string representation of this Node </returns>
		public override string ToString() {
			if (Value is object) {
				return "(" + Value.ToString() + ", " + Height + ")";
			}
			
			return "(" + Value + ", " + Height + ")";
		}
	}
}

